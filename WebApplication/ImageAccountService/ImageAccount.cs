using System.Collections.Generic;
using System.Linq;
using Domain;

namespace WebApplication.ImageAccountService
{
    public class ImageAccount
    {
        private readonly Dictionary<byte, ImageInfo> _info =
            new Dictionary<byte, ImageInfo>();

        private byte _last = 0;

        public byte Register(Image image, Histogram redHistogram,  Histogram greenHistogram,  Histogram blueHistogram)
        {
            _info.Add(_last, new ImageInfo(image, redHistogram, greenHistogram, blueHistogram));
            return _last++;
        }

        public void Remove(byte id) =>
            _info.Remove(id);

        public bool Contains(byte id) =>
            _info.Keys.Contains(id);

        public ImageInfo this[byte id] => _info[id];
    }
}