using System;

namespace Domain
{
    public class Color
    {
        public Color(int r, int g, int b)
        {
            if (r > 255 || r < 0) throw new Exception("Значение красного цвета не входит в диапазон допустимых значений");
            if (g > 255 || g < 0) throw new Exception("Значение зеленого цвета не входит в диапазон допустимых значений");
            if (b > 255 || b < 0) throw new Exception("Значение синего цвета не входит в диапазон допустимых значений");
            
            R = r;
            G = g;
            B = b;
        }

        public int R { get; }
        public int G { get; }
        public int B { get; }
    }
}