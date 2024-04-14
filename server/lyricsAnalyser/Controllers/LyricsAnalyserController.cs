using lyricsAnalyser.Services;
using Microsoft.AspNetCore.Hosting.Server;
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
        public async Task<ActionResult<string>> Get([FromQuery] string youtubeLink)
        {
            var voiceFile = await VoiceIsolator.IsolateVocals(youtubeLink);
            if (voiceFile != null)
            {
                //return lyrics;
                return voiceFile;
            }
            return NoContent();
        }
    }
}
