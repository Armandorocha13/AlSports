# Script para remover diretórios duplicados da raiz do projeto
# Estes diretórios já existem em al-sport-frontend/

$rootPath = Get-Location
$directoriesToRemove = @("app", "components", "contexts", "hooks", "lib", "public", "tests")

Write-Host "=== Remoção de Diretórios Duplicados ===" -ForegroundColor Yellow
Write-Host "Este script removerá os seguintes diretórios da raiz:" -ForegroundColor Cyan
foreach ($dir in $directoriesToRemove) {
    Write-Host "  - $dir" -ForegroundColor Gray
}
Write-Host "`nEstes diretórios já existem em al-sport-frontend/" -ForegroundColor Green
Write-Host ""

$confirmation = Read-Host "Deseja continuar? (S/N)"
if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit
}

Write-Host "`nIniciando remoção..." -ForegroundColor Green

foreach ($dir in $directoriesToRemove) {
    $dirPath = Join-Path $rootPath $dir
    if (Test-Path $dirPath) {
        try {
            Write-Host "Removendo $dir..." -ForegroundColor Cyan
            Remove-Item -Path $dirPath -Recurse -Force
            Write-Host "✓ $dir removido com sucesso" -ForegroundColor Green
        } catch {
            Write-Host "✗ Erro ao remover $dir : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ $dir não encontrado, pulando..." -ForegroundColor Yellow
    }
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green
Write-Host "Diretórios duplicados foram removidos da raiz." -ForegroundColor Green



