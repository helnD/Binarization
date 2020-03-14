using System.Linq;
using Domain;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Adapters.InputAdapter;
using WebApplication.Adapters.OutputAdapter;
using WebApplication.ImageAccountService;
using ImageAdapter = WebApplication.Adapters.InputAdapter.ImageAdapter;

namespace WebApplication.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult LoadImage([FromServices]ImageAccount imageAccount)
        {
            var image = new ImageAdapter(Request.Form.Files["image_input"])
                .Adapt();
            
            var histogramBuilder = new HistogramBuilder(image);
            var redHistogram = histogramBuilder
                .Color(ColorSpectrum.Red)
                .Build();
            var greenHistogram = histogramBuilder
                .Color(ColorSpectrum.Green)
                .Build();
            var blueHistogram = histogramBuilder
                .Color(ColorSpectrum.Blue)
                .Build();
            
            var id = imageAccount.Register(image, redHistogram, greenHistogram, blueHistogram);

            return Json(new
            {
                histograms = new HistogramAdapter(redHistogram, greenHistogram, blueHistogram).Adapt(),
                id
            });
        }

        public IActionResult Binarization([FromServices]ImageAccount imageAccount)
        {
            var thresholds = new ThresholdAdapter(Request.Query)
                .Adapt();

            var redThresholds = thresholds.First(it => it.Spectrum == ColorSpectrum.Red);
            var greenThresholds = thresholds.First(it => it.Spectrum == ColorSpectrum.Green);
            var blueThresholds = thresholds.First(it => it.Spectrum == ColorSpectrum.Blue);
            
            var resultImage = new BinarizerBuilder()
                .RedTemplate(redThresholds.Template)
                .GreenTemplate(greenThresholds.Template)
                .BlueTemplate(blueThresholds.Template)
                .RedThresholds(redThresholds.Thresholds)
                .GreenThresholds(greenThresholds.Thresholds)
                .BlueThresholds(blueThresholds.Thresholds)
                .Build()
                .Binarization(imageAccount[new IdAdapter(Request.Query).Adapt()].Image);

            return File(new Adapters.OutputAdapter.ImageAdapter(resultImage).Adapt(), "image/png");
        }
    }
}