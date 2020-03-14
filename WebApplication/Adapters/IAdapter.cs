namespace WebApplication.Adapters
{
    public interface IAdapter <out T>
    {
        T Adapt();
    }
}