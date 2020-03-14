using Domain;

namespace WebApplication.ImageAccountService
{
    public class ImageInfo
    {
        public ImageInfo(Image image, Histogram redHistogram, Histogram greenHistogram, Histogram blueHistogram)
        {
            Image = image;
            RedHistogram = redHistogram;
            GreenHistogram = greenHistogram;
            BlueHistogram = blueHistogram;
        }

        public Image Image { get; }
        public Histogram RedHistogram { get; }
        public Histogram GreenHistogram { get; }
        public Histogram BlueHistogram { get; }
    }
}