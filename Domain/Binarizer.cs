using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Domain
{
    public class Binarizer
    {

        private readonly Threshold[] _redThresholds;
        private readonly Threshold[] _greenThresholds;
        private readonly Threshold[] _blueThresholds;

        private readonly string _redTemplate;
        private readonly string _greenTemplate;
        private readonly string _blueTemplate;

        internal Binarizer([NotNull]Threshold[] redThresholds, [NotNull]Threshold[] greenThresholds,
            [NotNull]Threshold[] blueThresholds, [NotNull]string redTemplate, [NotNull]string greenTemplate,
            [NotNull]string blueTemplate)
        {
            
            if (redThresholds.Length == 0) throw new Exception("Отсутствуют пороги для красного цвета");
            if (greenThresholds.Length == 0) throw new Exception("Отсутствуют пороги для зеленого цвета");
            if (blueThresholds.Length == 0) throw new Exception("Отсутствуют пороги для синего цвета");
            
            _redThresholds = redThresholds;
            _greenThresholds = greenThresholds;
            _blueThresholds = blueThresholds;
            
            _redTemplate = redTemplate;
            _greenTemplate = greenTemplate;
            _blueTemplate = blueTemplate;
        }

        public Image Binarization([NotNull]Image image)
        {
            var result = new Color[image.Height][];
            for (var y = 0; y < image.Height; y++)
            {
                result[y] = new Color[image.Width];
                for (var x = 0; x < image.Width; x++)
                {
                    result[y][x] = BinarizedColor(image[x, y]);
                }
            }
            
            return new Image(result);
        }

        private Color BinarizedColor([NotNull]Color color)
        {
            var red = SpectrumBinarizedValue(color, ColorSpectrum.Red);
            var green = SpectrumBinarizedValue(color, ColorSpectrum.Green);
            var blue = SpectrumBinarizedValue(color, ColorSpectrum.Blue);
            
            return new Color(red, green, blue);
        }

        private int SpectrumBinarizedValue(Color color, ColorSpectrum spectrum)
        {
            Func<Color, int, int, bool> predicate;
            Threshold[] threshold;
            string template;

            switch (spectrum)
            {
                case ColorSpectrum.Red:
                    predicate = (c, l, r) => c.R > l && c.R < r;
                    threshold = _redThresholds;
                    template = _redTemplate;
                    break;
                case ColorSpectrum.Green:
                    predicate = (c, l, r) => c.G > l && c.G < r;
                    threshold = _greenThresholds;
                    template = _greenTemplate;
                    break;
                case ColorSpectrum.Blue:
                    predicate = (c, l, r) => c.B > l && c.B < r;
                    threshold = _blueThresholds;
                    template = _blueTemplate;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(spectrum), spectrum, null);
            }
            
            var value = 0;
            var left = -1;

            for (var index = 0; index <= threshold.Length; index++)
            {
                var right = index == threshold.Length ? 256 : threshold[index].Value;
                if (predicate(color, left, right))
                {
                    value = int.Parse(template[index].ToString()) * 255;
                    break;
                }

                left = right;
            }

            return value;
        }
        
    }
}