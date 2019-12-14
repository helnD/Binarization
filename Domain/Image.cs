
using System;
using System.Diagnostics.CodeAnalysis;

namespace Domain
{
    public class Image
    {
        private readonly Color[][] _image;

        public Image([NotNull]Color[][] image)
        {
            
            void EmptyException() => throw new Exception("Изображение не может быть пустым");

            if (image.Length == 0) EmptyException();
            foreach (var row in image)
            {
                if (row == null || row.Length == 0) EmptyException();
            }
            
            _image = image;
            Height = image.Length;
            Width = image[0].Length;
        }

        public int Height { get; }
        public int Width { get; }
        
        public Color this[int x, int y] =>
            _image[y][x];
    }
}