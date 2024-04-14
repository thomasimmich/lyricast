using lyricsAnalyser.Services;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Whisper.net;

namespace lyricsAnalyser.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LyricsAnalyserController : ControllerBase
    {

        private readonly ILogger<LyricsAnalyserController> _logger;
        private readonly ISpeechToTextProcessor _processor;

        public LyricsAnalyserController(ILogger<LyricsAnalyserController> logger)
        {
            _logger = logger;
            _processor = new WhisperSpeechToTextProcessor(_logger);
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

        [HttpGet("speechtotext")]
        public async Task<ActionResult<List<SegmentData>>> SpeechToTest([FromQuery] string pathToVocal)
        {
            var lyrics = await _processor.ProcessAsync(pathToVocal);
            return lyrics;
        }
    }
}
