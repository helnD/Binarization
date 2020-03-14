using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Domain;
using Microsoft.AspNetCore.Http;
using WebApplication.Adapters.AdaptedEntities;

namespace WebApplication.Adapters.InputAdapter
{
    public class ThresholdAdapter : IAdapter<AdaptedThresholds[]>
    {
        private IQueryCollection _query;

        public ThresholdAdapter(IQueryCollection query)
        {
            _query = query;
        }

        public AdaptedThresholds[] Adapt()
        {
            var redTemplate = _query["redTemplate"];
            var greenTemplate = _query["greenTemplate"];
            var blueTemplate = _query["blueTemplate"];

            var numberRegex = new Regex("[0-9]");

            var redSet = _query.Where(it => it.Key[0] == 'r' && numberRegex.IsMatch(it.Key[1].ToString()))
                .OrderBy(it => it.Key.Substring(1));
            var greenSet = _query.Where(it => it.Key[0] == 'g' && numberRegex.IsMatch(it.Key[1].ToString()))
                .OrderBy(it => it.Key.Substring(1));
            var blueSet = _query.Where(it => it.Key[0] == 'b' && numberRegex.IsMatch(it.Key[1].ToString()))
                .OrderBy(it => it.Key.Substring(1));

            var redThresholds = new List<Threshold>();
            var greenThresholds = new List<Threshold>();
            var blueThresholds = new List<Threshold>();
            
            foreach (var pair in redSet)
            {
                var value = int.Parse(pair.Value);
                redThresholds.Add(new Threshold(ColorSpectrum.Red, value));
            }
            
            foreach (var pair in greenSet)
            {
                var value = int.Parse(pair.Value);
                greenThresholds.Add(new Threshold(ColorSpectrum.Green, value));
            }
            
            foreach (var pair in blueSet)
            {
                var value = int.Parse(pair.Value);
                blueThresholds.Add(new Threshold(ColorSpectrum.Blue, value));
            }

            return new[] {
                new AdaptedThresholds(redThresholds.ToArray(), redTemplate),
                new AdaptedThresholds(greenThresholds.ToArray(), greenTemplate),
                new AdaptedThresholds(blueThresholds.ToArray(), blueTemplate)
            };
        }
    }
}