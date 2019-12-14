using System.Diagnostics.CodeAnalysis;

namespace Domain
{
    public class Threshold
    {
        public Threshold([NotNull]ColorSpectrum spectrum, int value)
        {
            Spectrum = spectrum;
            Value = value;
        }

        public ColorSpectrum Spectrum { get; }
        public int Value { get; }
    }
}