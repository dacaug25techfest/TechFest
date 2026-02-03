using System.Collections.Generic;

namespace Organizer.Models
{
    public class AgeBucketInfo
    {
        public int FromAge { get; set; }  // inclusive
        public int ToAge { get; set; }    // inclusive
        public int Count { get; set; }
    }

    public class EventAnalyticsDto
    {
        public int EventId { get; set; }
        public string EventName { get; set; } = string.Empty;

        public string StateName { get; set; } = string.Empty;
        public string CityName { get; set; } = string.Empty;

        public int TotalRegistrations { get; set; }
        public int TotalPeople { get; set; }

        public List<AgeBucketInfo> AgeBuckets { get; set; } = new();
    }
}

