import WidgetKit
import SwiftUI

struct Emotion {
    let id: Int
    let name: String
    let imageName: String
    let color: Color
    let bgColor: Color
    let count: Int
}



struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), emotionCounts: [:], weeklyMoodData: [:])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let counts = fetchEmotionCounts()
        let weeklyData = fetchWeeklyMoodData()
        let entry = SimpleEntry(date: Date(), emotionCounts: counts, weeklyMoodData: weeklyData)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let counts = fetchEmotionCounts()
        let weeklyData = fetchWeeklyMoodData()
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, emotionCounts: counts, weeklyMoodData: weeklyData)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
    
  func fetchEmotionCounts() -> [String: Int] {
      let defaults = UserDefaults(suiteName: "group.samuelprasad.happy")
      return (
          defaults?
              .data(forKey: "emotionCounts")
              .flatMap { try? JSONDecoder().decode([String: Int].self, from: $0) }
      ) ?? [:]
  }
    
  func fetchWeeklyMoodData() -> [String: Int] {
      let defaults = UserDefaults(suiteName: "group.samuelprasad.happy")
      return (
          defaults?
              .data(forKey: "weeklyMoodData")
              .flatMap { try? JSONDecoder().decode([String: Int].self, from: $0) }
      ) ?? [:]
  }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let emotionCounts: [String: Int]
    let weeklyMoodData: [String: Int]
}

struct EmotionItemView: View {
    let emotion: Emotion
    
    var body: some View {
        VStack(spacing: 6) {
            ZStack {
                Circle()
                .fill(emotion.bgColor)
                .frame(width: 44, height: 44)
                
                // Ensure these images are added to your Widget Target's Assets.xcassets
                Image(emotion.imageName)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 32, height: 32)
                
                if emotion.count > 0 {
                    ZStack {
                        Circle()
                            .fill(Color(red: 139/255, green: 92/255, blue: 246/255)) // Violet-500
                            .frame(width: 20, height: 20)
                        
                        Text("\(emotion.count)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .offset(x: 16, y: -16)
                }
            }
            
            Text(emotion.name)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(Color(red: 55/255, green: 65/255, blue: 81/255)) // Gray-700
        }
        .frame(maxWidth: .infinity)
    }
}

struct widgetEntryView : View {
    var entry: Provider.Entry
    
    var emotions: [Emotion] {
        let counts = entry.emotionCounts
        return [
            Emotion(id: 1, name: "Terrible", imageName: "terrible", color: Color(hex: "FF6B6B"), bgColor: Color(hex: "FFE5E5"), count:  counts["1"] ?? 0),
            Emotion(id: 2, name: "Bad", imageName: "bad", color: Color(hex: "FFA94D"), bgColor: Color(hex: "FFF3E5"), count: counts["2"] ?? 0),
            Emotion(id: 3, name: "Okay", imageName: "fine", color: Color(hex: "FFD43B"), bgColor: Color(hex: "FFF9E5"), count: counts["3"] ?? 0),
            Emotion(id: 4, name: "Good", imageName: "good", color: Color(hex: "69DB7C"), bgColor: Color(hex: "E5F9E5"), count: counts["4"] ?? 0),
            Emotion(id: 5, name: "Great", imageName: "great", color: Color(hex: "74C0FC"), bgColor: Color(hex: "E5F3FF"), count: counts["5"] ?? 0)
        ]
    }
    
    var averageMood: Double? {
        let totalCount = emotions.reduce(0) { $0 + $1.count }
        guard totalCount > 0 else { return nil }
        
        let weightedSum = emotions.reduce(0) { $0 + ($1.id * $1.count) }
        return Double(weightedSum) / Double(totalCount)
    }
    
    var moodLabel: (text: String, color: Color)? {
        guard let avg = averageMood else { return nil }
        
        if avg <= 1.5 {
            return ("Terrible", Color(hex: "FF6B6B"))
        } else if avg <= 2.5 {
            return ("Bad", Color(hex: "FFA94D"))
        } else if avg <= 3.5 {
            return ("Okay", Color(hex: "FFD43B"))
        } else if avg <= 4.5 {
            return ("Good", Color(hex: "69DB7C"))
        } else {
            return ("Great", Color(hex: "74C0FC"))
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Daily Mood Log")
                    .font(.system(size: 16, weight: .semibold, design: .serif))
                    .foregroundColor(Color(red: 17/255, green: 24/255, blue: 39/255)) // Gray-900
                
                Spacer()
                
                HStack(spacing: 4) {
                    if let avgMood = averageMood, let label = moodLabel {
                        HStack(spacing: 4) {
                            Text(label.text)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(label.color)
                            
                            Text("•")
                                .font(.system(size: 11))
                                .foregroundColor(Color(red: 156/255, green: 163/255, blue: 175/255)) // Gray-400
                            
                            Text(String(format: "%.1f", avgMood))
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(label.color)
                        }
                    }
                    
                    Text(entry.date.formatted(.dateTime.month().day().year()))
                        .font(.system(size: 12))
                        .foregroundColor(Color(red: 107/255, green: 114/255, blue: 128/255)) // Gray-500
                }
            }
            
            HStack(spacing: 0) {
                ForEach(emotions, id: \.id) { emotion in
                    EmotionItemView(emotion: emotion)
                }
            }
        }
        .padding()
        .background(Color.white)
    }
}

// MARK: - Weekly Mood Line Graph Widget View
struct WeeklyMoodLineGraphView: View {
    var entry: Provider.Entry
    let chartHeight: CGFloat = 100
    
    var weekDays: [String] {
        return ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
    }
    
    var moodScores: [Int] {
        // Build array from dictionary, index 0-6 corresponds to Sun-Sat
        return (0..<7).map { index in
            entry.weeklyMoodData[String(index)] ?? 0
        }
    }
    
    var body: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                // Chart Area
                ZStack(alignment: .bottomLeading) {
                    // 5 Horizontal grid lines
                    VStack(spacing: 0) {
                        ForEach(0..<5) { i in
                            Divider()
                                .background(Color.gray.opacity(0.2))
                            if i < 4 {
                                Spacer()
                            }
                        }
                    }
                    .frame(height: chartHeight)
                    
                    // Line graph with Canvas
                    Canvas { context, size in
                        let points = calculatePoints(size: size)
                        
                        // Draw connecting lines between consecutive non-nil points
                        var lastPoint: CGPoint? = nil
                        for i in 0..<points.count {
                            if let point = points[i] {
                                if let last = lastPoint {
                                    var path = Path()
                                    path.move(to: last)
                                    path.addLine(to: point)
                                    
                                    context.stroke(path, with: .color(Color.gray.opacity(0.3)), lineWidth: 1.5)
                                }
                                lastPoint = point
                            }
                        }
                        
                        // Draw colored dots
                        for (index, point) in points.enumerated() {
                            if let pt = point {
                                let score = moodScores[index]
                                let dotColor = getMoodColor(score)
                                context.fill(
                                    Circle().path(in: CGRect(x: pt.x - 4, y: pt.y - 4, width: 8, height: 8)),
                                    with: .color(dotColor)
                                )
                            }
                        }
                    }
                    .frame(height: chartHeight)
                }
                .frame(height: chartHeight)
                .padding(.leading, 12)
                
                // Mood Legend - 5 emotion images aligned exactly on the 5 lines
                VStack(spacing: 0) {
                    MoodImageLegend(imageName: "great")
                    Spacer()
                    MoodImageLegend(imageName: "good")
                    Spacer()
                    MoodImageLegend(imageName: "fine")
                    Spacer()
                    MoodImageLegend(imageName: "bad")
                    Spacer()
                    MoodImageLegend(imageName: "terrible")
                }
                .frame(height: chartHeight)
                .padding(.trailing, 8)
            }
            
            // Day labels below the chart
            HStack(spacing: 0) {
                ForEach(0..<7, id: \.self) { index in
                    Text(weekDays[index])
                        .font(.system(size: 9, weight: .medium))
                        .foregroundColor(Color.gray.opacity(0.6))
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.leading, 12)
            .padding(.trailing, 28) // Account for legend width
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 8)
        .background(Color.white)
    }
    
    func calculatePoints(size: CGSize) -> [CGPoint?] {
        return moodScores.enumerated().map { index, score in
            guard score > 0 else { return nil }
            return calculatePoint(index: index, score: score, size: size)
        }
    }
    
    func calculatePoint(index: Int, score: Int, size: CGSize) -> CGPoint {
        let spacing = size.width / 7
        let x = CGFloat(index) * spacing + spacing / 2
        
        // Map score (1-5) to Y position - aligned exactly on the 5 horizontal lines
        // Score 5 (great) -> Line 1 at 0% (top)
        // Score 4 (good) -> Line 2 at 25%
        // Score 3 (okay) -> Line 3 at 50% (middle)
        // Score 2 (bad) -> Line 4 at 75%
        // Score 1 (terrible) -> Line 5 at 100% (bottom)
        
        let positions: [Int: CGFloat] = [
            5: 0.0,   // great - top line
            4: 0.25,  // good - 2nd line
            3: 0.5,   // okay - middle line
            2: 0.75,  // bad - 4th line
            1: 1.0    // terrible - bottom line
        ]
        
        let clampedScore = max(1, min(5, score))
        let y = (positions[clampedScore] ?? 0.5) * size.height
        return CGPoint(x: x, y: y)
    }
    
    func getMoodColor(_ score: Int) -> Color {
        switch score {
        case 1: return Color(hex: "FF6B6B")   // terrible
        case 2: return Color(hex: "FFA94D")   // bad
        case 3: return Color(hex: "FFD43B")   // fine
        case 4: return Color(hex: "69DB7C")   // good
        case 5: return Color(hex: "74C0FC")   // great
        default: return Color(hex: "FFD43B") // default to fine
        }
    }
}

struct MoodImageLegend: View {
    let imageName: String
    
    var body: some View {
        Image(imageName)
            .resizable()
            .scaledToFit()
            .frame(width: 16, height: 16)
    }
}




struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.white, for: .widget)
        }
        .supportedFamilies([.systemMedium])
        .configurationDisplayName("Mood Logger")
        .description("Log your daily mood.")
    }
}

// Weekly Mood Line Graph Widget
struct WeeklyMoodTrendWidget: Widget {
    let kind: String = "WeeklyMoodTrendWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            WeeklyMoodLineGraphView(entry: entry)
                .containerBackground(.white, for: .widget)
        }
        .supportedFamilies([.systemMedium])
        .configurationDisplayName("Weekly Mood Trend")
        .description("Track your weekly mood patterns with a line graph.")
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

#Preview("Mood Logger", as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(date: .now, emotionCounts: Provider().fetchEmotionCounts(), weeklyMoodData: [:])
}

#Preview("Weekly Line Graph", as: .systemMedium) {
    WeeklyMoodTrendWidget()
} timeline: {
    SimpleEntry(
        date: .now,
        emotionCounts: [:],
        weeklyMoodData: Provider().fetchWeeklyMoodData()
    )
}
