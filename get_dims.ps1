Add-Type -AssemblyName System.Drawing
$path = 'o:\projects\typosaur\animation_projects\pixel-cat-run\public\assets\cat.png'
$img = [System.Drawing.Image]::FromFile($path)
Write-Host "$($img.Width) x $($img.Height)"
$img.Dispose()
