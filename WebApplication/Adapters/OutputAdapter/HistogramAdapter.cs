using System.Collections.Generic;
using System.Linq;
using Domain;

namespace WebApplication.Adapters.OutputAdapter
{
    public class HistogramAdapter : IAdapter<int[][]>
    {
        private readonly Histogram _redHistogram;
        private readonly Histogram _greenHistogram;
        private readonly Histogram _blueHistogram;

        public HistogramAdapter(Histogram redHistogram, Histogram greenHistogram, Histogram blueHistogram)
        {
            _greenHistogram = greenHistogram;
            _blueHistogram = blueHistogram;
            _redHistogram = redHistogram;
        }

        public int[][] Adapt()
        {
            var result = new List<List<int>>();

            var red = new List<int>();
            foreach (var column in _redHistogram)
            {
                red.Add((int)column);
            }
            result.Add(red);
            
            var green = new List<int>();
            foreach (var column in _greenHistogram)
            {
                green.Add((int)column);
            }
            result.Add(green);
            
            var blue = new List<int>();
            foreach (var column in _blueHistogram)
            {
                blue.Add((int)column);
            }
            result.Add(blue);

            return result.Select(it => it.ToArray()).ToArray();
        }
    }
}