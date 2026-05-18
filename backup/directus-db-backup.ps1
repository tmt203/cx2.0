param(
  [ValidateSet("backup","restore")]
  [string]$Action = "backup",

  [string]$Container = "cx-demo-db",
  [string]$DbName = "directus",
  [string]$DbUser = "directus",

  # Duong dan file dump (neu de trong se tu tao ten)
  [string]$DumpPath = ""
)

function New-DumpPath {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  return ".\directus-$stamp.dump"
}

if ($Action -eq "backup") {
  if ([string]::IsNullOrWhiteSpace($DumpPath)) {
    $DumpPath = New-DumpPath
  }

  docker exec -t $Container pg_dump -U $DbUser -F c -f /tmp/directus.dump $DbName
  if ($LASTEXITCODE -ne 0) { throw "pg_dump failed" }

  docker cp "$Container`:/tmp/directus.dump" $DumpPath
  if ($LASTEXITCODE -ne 0) { throw "docker cp failed" }

  Write-Host "Backup OK: $DumpPath"
}
elseif ($Action -eq "restore") {
  if ([string]::IsNullOrWhiteSpace($DumpPath)) {
    throw "DumpPath is required for restore"
  }

  docker cp $DumpPath "$Container`:/tmp/directus.dump"
  if ($LASTEXITCODE -ne 0) { throw "docker cp failed" }

  docker exec -t $Container pg_restore -U $DbUser -d $DbName --clean --if-exists /tmp/directus.dump
  if ($LASTEXITCODE -ne 0) { throw "pg_restore failed" }

  Write-Host "Restore OK: $DumpPath"
}