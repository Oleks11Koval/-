<#
  build.ps1 — bundles the site into ONE self-contained file: dist/index.html

  Inlines every css/*.css and js/*.js referenced from index.html, and embeds
  each image from assets/img exactly once (shared between both roles).
  Usage:  powershell -ExecutionPolicy Bypass -File build.ps1
#>
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText("$root\index.html", $utf8)

# 1. Stylesheets -> <style>
$html = [regex]::Replace($html, '<link rel="stylesheet" href="(css/[^"]+)">', {
  param($m) '<style>' + [IO.File]::ReadAllText("$root\" + $m.Groups[1].Value, $utf8).Trim() + '</style>'
})

# 2. Images -> one shared map, referenced by name
$images = [ordered]@{}
$html = [regex]::Replace($html, 'src="assets/img/([\w-]+)\.(jpg|png|webp)"', {
  param($m)
  $name = $m.Groups[1].Value
  if (-not $images.Contains($name)) {
    $mime = @{ jpg = 'jpeg'; png = 'png'; webp = 'webp' }[$m.Groups[2].Value]
    $bytes = [IO.File]::ReadAllBytes("$root\assets\img\$name.$($m.Groups[2].Value)")
    $images[$name] = "data:image/$mime;base64," + [Convert]::ToBase64String($bytes)
  }
  'data-inline="' + $name + '"'
})
$html = [regex]::Replace($html, '\s*<link rel="preload" as="image"[^>]*>', '')

# 3. Scripts -> inline, same order
$scripts = ''
$html = [regex]::Replace($html, '\s*<script src="(js/[^"]+)" defer></script>', {
  param($m)
  $script:scripts += "`n" + [IO.File]::ReadAllText("$root\" + $m.Groups[1].Value, $utf8)
  ''
})
$map = ($images.GetEnumerator() | ForEach-Object { '"' + $_.Key + '":"' + $_.Value + '"' }) -join ','
$loader = "(function(){var m={$map};document.querySelectorAll('img[data-inline]').forEach(function(i){i.src=m[i.dataset.inline];});})();"
$html = $html.Replace('</body>', "<script>`n$loader$scripts`n</script>`n</body>")

New-Item -ItemType Directory -Force "$root\dist" | Out-Null
[IO.File]::WriteAllText("$root\dist\index.html", $html, $utf8)
"Built dist/index.html ({0:N0} KB)" -f ((Get-Item "$root\dist\index.html").Length / 1KB)
