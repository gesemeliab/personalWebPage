<#
.SYNOPSIS
  Builds the About-section portrait from any source photo.

.DESCRIPTION
  The browser downscales a large photo poorly, worse still inside the card's
  rotation, so fine textures turn grainy. This crops the source to the frame's
  aspect ratio and resamples it once, with high-quality bicubic filtering, to the
  exact display sizes: 1x, 2x and 3x of the 345 x 325 px frame.

  Writes public/images/portrait-345.jpg, portrait-690.jpg and portrait-1035.jpg.

.PARAMETER Source
  The original photo, e.g. public/images/portrait.jpeg.

.PARAMETER Top
  Where the crop sits vertically, 0 (top) to 1 (bottom). Default 0.32 sits the head near the top of the frame.

.EXAMPLE
  pwsh scripts/portrait.ps1 public/images/portrait.jpeg
#>
param(
  [Parameter(Mandatory)][string]$Source,
  [double]$Top = 0.32,
  [int]$Quality = 100
)

Add-Type -AssemblyName System.Drawing

$frameW = 345
$frameH = 325
$outDir = Join-Path $PSScriptRoot "..\public\images"

$src = [System.Drawing.Image]::FromFile((Resolve-Path $Source))
try {
  # Largest crop with the frame's aspect ratio, biased vertically by $Top.
  $cropW = $src.Width
  $cropH = [int][math]::Round($cropW * $frameH / $frameW)
  if ($cropH -gt $src.Height) {
    $cropH = $src.Height
    $cropW = [int][math]::Round($cropH * $frameW / $frameH)
  }
  $cropX = [int](($src.Width - $cropW) / 2)
  $cropY = [int](($src.Height - $cropH) * $Top)

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq "image/jpeg"
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

  foreach ($scale in 1, 2, 3) {
    $w = $frameW * $scale
    $h = $frameH * $scale
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $attrs = New-Object System.Drawing.Imaging.ImageAttributes
    $attrs.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY) # no dark fringe at the edges
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $cropX, $cropY, $cropW, $cropH, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
    $out = Join-Path $outDir "portrait-$w.jpg"
    $bmp.Save($out, $codec, $params)
    $g.Dispose(); $bmp.Dispose()
    "wrote $out ($w x $h)"
  }
}
finally {
  $src.Dispose()
}
