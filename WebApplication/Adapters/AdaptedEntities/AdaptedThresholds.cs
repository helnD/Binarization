using System.Linq;
using Domain;

namespace WebApplication.Adapters.AdaptedEntities
{
    public class AdaptedThresholds
    {
        public AdaptedThresholds(Threshold[] thresholds, string template)
        {
            Thresholds = thresholds;
            Template = template;
        }

        public Threshold[] Thresholds { get; }
        public string Template { get; }
        public ColorSpectrum Spectrum => Thresholds.First().Spectrum;
    }
}