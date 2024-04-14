using Microsoft.VisualBasic;
using System.Text;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using Whisper.net;
using Whisper.net.Ggml;

namespace lyricsAnalyser.Services;

public class WhisperSpeechToTextProcessor : ISpeechToTextProcessor
{
    private readonly ILogger m_logger;
    private readonly GgmlType m_GgmlType = GgmlType.Base;
    private readonly string m_ModelFileName = "ggml-base.bin";
    private readonly string m_Language;
    private WhisperFactory m_WhisperFactory;
    private WhisperProcessor m_Pprocessor;

    public WhisperSpeechToTextProcessor(ILogger logger, string language = "auto")
    {
        m_logger = logger;
        m_Language = language;

        m_logger.LogInformation("Initialize whisper STT processor");

        Init();
    }

    private void Init()
    {
        // This section creates the whisperFactory object which is used to create the processor object.
        m_WhisperFactory = WhisperFactory.FromPath(m_ModelFileName);

        // This section creates the processor object which is used to process the audio file, it uses language `auto` to detect the language of the audio file.
        m_Pprocessor = m_WhisperFactory.CreateBuilder()
            .WithLanguage(m_Language)
            .Build();

        // This section detects whether the "ggml-base.bin" file exists in our project disk. If it doesn't, it downloads it from the internet
        if (!File.Exists(m_ModelFileName))
        {
            DownloadModel(m_ModelFileName, m_GgmlType).GetAwaiter().GetResult();
        }
    }

    public async Task<List<SegmentData>> ProcessAsync(string pathToVocal)
    {
        m_logger.LogInformation("Process started");

        var transcript = new List<SegmentData>();

        await using var wavStream = ResampleWaveFile(pathToVocal);

        // This section processes the audio file and logs the results (start time, end time and text) to the console.
        await foreach (var result in m_Pprocessor.ProcessAsync(wavStream))
        {
            transcript.Add(result);
            m_logger.LogDebug($"{result.Start}->{result.End}: {result.Text}");
        }

        m_logger.LogInformation("Process finished");

        return transcript;
    }

    private async Task DownloadModel(string fileName, GgmlType ggmlType)
    {
        m_logger.LogInformation($"Downloading Model {fileName} started");

        await using var modelStream = await WhisperGgmlDownloader.GetGgmlModelAsync(ggmlType);
        await using var fileWriter = File.OpenWrite(fileName);
        await modelStream.CopyToAsync(fileWriter);

        m_logger.LogInformation($"Downloading Model {fileName} finished");
    }

    private Stream ConvertMp3ToWaveFile(string mp3File)
    {
        // This section opens the mp3 file and converts it to a wav file with 16Khz sample rate.
        using var fileStream = File.OpenRead(mp3File);

        var wavStream = new MemoryStream();

        using var reader = new Mp3FileReader(fileStream);
        var resampler = new WdlResamplingSampleProvider(reader.ToSampleProvider(), 16000);
        WaveFileWriter.WriteWavFileToStream(wavStream, resampler.ToWaveProvider16());

        // This section sets the wavStream to the beginning of the stream. (This is required because the wavStream was written to in the previous section)
        wavStream.Seek(0, SeekOrigin.Begin);
        return wavStream;
    }

    private Stream ResampleWaveFile(string waveFile)
    {
        // This section opens the mp3 file and converts it to a wav file with 16Khz sample rate.
        using var fileStream = File.OpenRead(waveFile);

        var wavStream = new MemoryStream();

        using var reader = new WaveFileReader(fileStream);
        var resampler = new WdlResamplingSampleProvider(reader.ToSampleProvider(), 16000);
        WaveFileWriter.WriteWavFileToStream(wavStream, resampler.ToWaveProvider16());

        // This section sets the wavStream to the beginning of the stream. (This is required because the wavStream was written to in the previous section)
        wavStream.Seek(0, SeekOrigin.Begin);
        return wavStream;
    }

    public void Dispose()
    {
        m_logger.LogInformation("Disposing whisper STT processor");

        m_Pprocessor.Dispose();
        m_WhisperFactory.Dispose();
    }
}