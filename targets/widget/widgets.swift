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
        SimpleEntry(date: Date(), emotionCounts: [:])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let counts = fetchEmotionCounts()
        let entry = SimpleEntry(date: Date(), emotionCounts: counts)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let counts = fetchEmotionCounts()
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, emotionCounts: counts)
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
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let emotionCounts: [String: Int]
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

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Daily Mood Log")
                    .font(.system(size: 16, weight: .semibold, design: .serif))
                    .foregroundColor(Color(red: 17/255, green: 24/255, blue: 39/255)) // Gray-900
                
                Spacer()
                
                Text(entry.date.formatted(.dateTime.month().day().year()))
                    .font(.system(size: 12))
                    .foregroundColor(Color(red: 107/255, green: 114/255, blue: 128/255)) // Gray-500
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

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(date: .now, emotionCounts: Provider().fetchEmotionCounts())
}
