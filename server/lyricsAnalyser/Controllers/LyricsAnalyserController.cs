using Microsoft.AspNetCore.Mvc;

namespace lyricsAnalyser.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LyricsAnalyserController : ControllerBase
    {

        private readonly ILogger<LyricsAnalyserController> _logger;

        public LyricsAnalyserController(ILogger<LyricsAnalyserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string Get()
        {
            return "Hello World";
        }
    }
}
