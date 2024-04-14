using Newtonsoft.Json;

namespace lyricsAnalyser.Services
{
    public class VoiceIsolator
    {
        public static async Task<string?> IsolateVocals(string youtubelink)
        {
            using var httpClient = new System.Net.Http.HttpClient();
            var sourceTrackInfos = "http://localhost/api/source-track/";
            using var response2 = await httpClient.GetAsync(sourceTrackInfos);
            var apiResponse = await response2.Content.ReadAsStringAsync();

            if (!string.IsNullOrEmpty(apiResponse))
            {
                var sourceTracks = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Models.SourceTracks>>(apiResponse);
                return JsonConvert.SerializeObject(sourceTracks); // only for testing
            }

            return null;
        }
    }
}
