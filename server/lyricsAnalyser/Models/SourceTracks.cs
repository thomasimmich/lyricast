namespace lyricsAnalyser.Models;

public class DynamicInfo
{
    public string Id { get; set; }
    public string Source_track { get; set; }
    public string Separator { get; set; }
    public int Bitrate { get; set; }
    public List<string> Extra_info { get; set; }
    public string Artist { get; set; }
    public string Title { get; set; }
    public string Vocals_url { get; set; }
    public string Other_url { get; set; }
    public string Piano_url { get; set; }
    public string Bass_url { get; set; }
    public string Drums_url { get; set; }
    public string Status { get; set; }
    public string Error { get; set; }
    public DateTime Date_created { get; set; }
    public DateTime Date_finished { get; set; }
}

public class SourceTracks
{
    public string Id { get; set; }
    public string Url { get; set; }
    public string Artist { get; set; }
    public string Title { get; set; }
    public List<object> Static { get; set; }
    public List<DynamicInfo> Dynamic { get; set; }
    public object Fetch_task_status { get; set; }
    public object Fetch_task_error { get; set; }
    public DateTime Date_created { get; set; }
    public object Fetch_task_date_finished { get; set; }
}