# https://github.com/yt-dlp/yt-dlp

# https://pypi.org/project/yt-dlp/
pip install yt-dlp

# Download the video
yt-dlp ""

# Convert the video to mp4 format
ffmpeg -i "" ""

# Windows convert PNG to JPEG
Add-Type -AssemblyName System.Drawing
Get-ChildItem -Filter *.png | ForEach-Object {
    $pngPath = $_.FullName
    $jpgPath = [System.IO.Path]::ChangeExtension($pngPath, ".jpeg")

    $image = [System.Drawing.Image]::FromFile($pngPath)
    $image.Save($jpgPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $image.Dispose()
}
