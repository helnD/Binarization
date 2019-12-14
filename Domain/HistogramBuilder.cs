using System.Diagnostics.CodeAnalysis;

namespace Domain
{
    public class HistogramBuilder
    {
        private readonly Image _image;
        private ColorSpectrum _spectrum;
        
        public HistogramBuilder([NotNull]Image image, [NotNull]ColorSpectrum spectrum = ColorSpectrum.Blue)
        {
            _image = image;
            _spectrum = spectrum;
        }

        public Histogram Build()
        {
            var result = new int[256];

            for (var y = 0; y < _image.Height; y++)
            {
                for (var x = 0; x < _image.Width; x++)
                {
                    result[Spectrum(_image[x, y])]++;
                }
            }
            
            return new Histogram(result);
        }

        private int Spectrum([NotNull]Color color)
        {
            int result;

            switch (_spectrum)
            {
                case ColorSpectrum.Blue:
                    result = color.B;
                    break;
                case ColorSpectrum.Green:
                    result = color.G;
                    break;
                default:
                    result = color.R;
                    break;
            }

            return result;
        }
    }
}