# Apply DTI CSV patches to hey-douga-guide and/or free-sample-hub (PowerShell)
param(
    [ValidateSet("hey-douga-guide", "free-sample-hub", "all")]
    [string]$Target = "all",
    [string]$Rakuten02Root = (Join-Path $env:USERPROFILE "rakuten02"),
    [string]$WorkRoot = $env:USERPROFILE
)

$ErrorActionPreference = "Stop"

function Apply-Patches {
    param(
        [string]$Repo,
        [string[]]$PatchNumbers
    )

    $patchDir = Join-Path $Rakuten02Root "patches\$Repo"
    $dest = Join-Path $WorkRoot $Repo

    Write-Host "==> $Repo"

    if (-not (Test-Path $patchDir)) {
        throw "Patch directory not found: $patchDir"
    }

    if (-not (Test-Path (Join-Path $dest ".git"))) {
        git clone "https://github.com/syunnjack/$Repo.git" $dest
    }

    Push-Location $dest
    try {
        git checkout master 2>$null
        if ($LASTEXITCODE -ne 0) { git checkout main }

        foreach ($num in $PatchNumbers) {
            $patch = Get-ChildItem $patchDir -Filter "${num}-*.patch" | Select-Object -First 1
            if (-not $patch) {
                throw "Patch ${num} not found in $patchDir"
            }
            Write-Host "    Applying $($patch.Name)"
            git am $patch.FullName
        }
    }
    finally {
        Pop-Location
    }
}

switch ($Target) {
    "hey-douga-guide" { Apply-Patches "hey-douga-guide" @("0001", "0002") }
    "free-sample-hub" { Apply-Patches "free-sample-hub" @("0001", "0002", "0003") }
    "all" {
        Apply-Patches "hey-douga-guide" @("0001", "0002")
        Apply-Patches "free-sample-hub" @("0001", "0002", "0003")
    }
}

Write-Host "Done."
