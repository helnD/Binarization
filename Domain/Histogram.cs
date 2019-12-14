using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Domain
{
    public class Histogram : IEnumerable
    {
        private readonly int[] _distribution;

        internal Histogram([NotNull]int[] distribution)
        {
            _distribution = distribution;
        }

        public IEnumerator GetEnumerator() =>
            _distribution.GetEnumerator();
    }
}