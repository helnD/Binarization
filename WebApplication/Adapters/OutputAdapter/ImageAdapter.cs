using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Advanced;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using Image = Domain.Image;

namespace WebApplication.Adapters.OutputAdapter
{
    public class ImageAdapter : IAdapter<byte[]>
    {
        private Image _image;

        public ImageAdapter(Image image)
        {
            _image = image;
        }

        public byte[] Adapt()
        {
            var image = new Image<Rgba32>(_image.Width, _image.Height);

            for (var y = 0; y < _image.Height; y++)
            {
                for (var x = 0; x < _image.Width; x++)
                {
                    image[x, y] = new Rgba32((byte)_image[x, y].R,
                        (byte)_image[x, y].G,
                        (byte)_image[x, y].B);
                }
            }

            using var memoryStream = new MemoryStream();
            var imageEncoder = image.GetConfiguration()
                .ImageFormatsManager
                .FindEncoder(PngFormat.Instance);
            
            image.Save(memoryStream, imageEncoder);
            return memoryStream.ToArray();
        }
    }
}