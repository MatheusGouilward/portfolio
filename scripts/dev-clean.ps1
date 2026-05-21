# scripts/dev-clean.ps1
# Mata processos Next dev órfãos deste projeto, limpa .next/ e inicia dev limpo.
# Resolve o problema de múltiplas instâncias acumulando após reinícios sucessivos
# (preview tools, hot-reload travado, builds órfãs segurando porta).

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot

Write-Host ""
Write-Host "[dev:clean] Procurando processos node deste projeto..." -ForegroundColor Yellow

# Match por nome de pasta do projeto. Substring tolera caracteres especiais no path.
$projectFolderName = Split-Path -Leaf $projectRoot

$victims = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq 'node.exe' -and
    $_.CommandLine -and
    $_.CommandLine.Contains($projectFolderName)
  }

if ($victims) {
  $count = ($victims | Measure-Object).Count
  Write-Host "[dev:clean] Encontrados $count processo(s) órfão(s). Encerrando..." -ForegroundColor Yellow
  foreach ($p in $victims) {
    try {
      Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop
      Write-Host ("[dev:clean]   PID=" + $p.ProcessId + " encerrado") -ForegroundColor Gray
    } catch {
      Write-Host ("[dev:clean]   PID=" + $p.ProcessId + " falhou: " + $_.Exception.Message) -ForegroundColor Red
    }
  }
  # Dá tempo do SO liberar handles + portas
  Start-Sleep -Milliseconds 800
} else {
  Write-Host "[dev:clean]   nenhum processo órfão encontrado" -ForegroundColor Gray
}

if (Test-Path .next) {
  Write-Host "[dev:clean] Limpando .next/" -ForegroundColor Yellow
  Remove-Item .next -Recurse -Force
}

Write-Host "[dev:clean] Iniciando next dev..." -ForegroundColor Green
Write-Host ""

# Inicia dev. Usa pnpm exec pra garantir resolução do binário local do next.
& pnpm exec next dev --turbopack
