using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace WebApplication.Adapters.InputAdapter
{
    public class ImageAdapter : IAdapter<Domain.Image>
    {
        private readonly IFormFile _file;

        public ImageAdapter(IFormFile file)
        {
            _file = file;
        }

        public Domain.Image Adapt()
        {
            var buffer = new byte[_file.Length];
            _file.OpenReadStream().Read(buffer, 0, (int) _file.Length);
            var image = Image.Load<Rgba32>(buffer);
            
            var result = new Domain.Color[image.Height][];
            for (var y = 0; y < image.Height; y++)
            {
                result[y] = new Domain.Color[image.Width];
                for (var x = 0; x < image.Width; x++)
                {
                    var pixel = image[x, y];
                    result[y][x] = new Domain.Color(pixel.R, pixel.G, pixel.B);
                }
            }

            return new Domain.Image(result);
        }
    }
}