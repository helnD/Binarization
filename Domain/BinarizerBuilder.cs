namespace Domain
{
    public class BinarizerBuilder
    {
        private Threshold[] _redThresholds = {new Threshold(ColorSpectrum.Red, 127) };
        private Threshold[] _greenThresholds = {new Threshold(ColorSpectrum.Green, 127) };
        private Threshold[] _blueThreshold = {new Threshold(ColorSpectrum.Blue, 127) };

        private string _redTemplate = "01";
        private string _greenTemplate = "01";
        private string _blueTemplate = "01";

        public BinarizerBuilder RedThresholds(Threshold[] value)
        {
            _redThresholds = value;
            return this;
        }
        
        public BinarizerBuilder GreenThresholds(Threshold[] value)
        {
            _greenThresholds = value;
            return this;
        }
        
        public BinarizerBuilder BlueThresholds(Threshold[] value)
        {
            _blueThreshold = value;
            return this;
        }
        
        public BinarizerBuilder RedTemplate(string value)
        {
            _redTemplate = value;
            return this;
        }
        
        public BinarizerBuilder GreenTemplate(string value)
        {
            _greenTemplate = value;
            return this;
        }
        
        public BinarizerBuilder BlueTemplate(string value)
        {
            _blueTemplate = value;
            return this;
        }

        public Binarizer Build() =>
            new Binarizer(_redThresholds, _greenThresholds, _blueThreshold,
                _redTemplate, _greenTemplate, _blueTemplate);
    }
}