using Whisper.net;

namespace lyricsAnalyser.Services;

public interface ISpeechToTextProcessor: IDisposable
{
    Task<List<SegmentData>> ProcessAsync(string pathToWavFile);
}