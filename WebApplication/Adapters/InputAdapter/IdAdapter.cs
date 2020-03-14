using Microsoft.AspNetCore.Http;

namespace WebApplication.Adapters.InputAdapter
{
    public class IdAdapter : IAdapter<byte>
    {
        private IQueryCollection _query;

        public IdAdapter(IQueryCollection query)
        {
            _query = query;
        }

        public byte Adapt() =>
            byte.Parse(_query["id"]);
    }
}