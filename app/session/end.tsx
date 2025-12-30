import CircleInherit from "@/components/CircleInherit";
import QuickExit from "@/components/QuickExit";
import SafeScreen from "@/components/SafeScreen";
import { extractIncidentFromTranscript } from "@/services/extractIncident";
import { transcribeAudio } from "@/services/transcribe";
import { useIncidentStore } from "@/store/useIncidentStore";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function EndSession() {
  const router = useRouter();
  const incidents = useIncidentStore((s) => s.incidents);
  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );

  const tryEnrichLatest = async () => {
    const latest = incidents[0];
    if (!latest || latest.transcript) return;

    try {
      const transcript = await transcribeAudio(
        latest.audioUri
      );

      const base = {
        ...latest,
        transcript,
      };

      updateIncident(base);

      const enrichment =
        await extractIncidentFromTranscript(
          transcript
        );

      if (enrichment) {
        updateIncident({
          ...base,
          ...enrichment,
        });
      }
    } catch {}
  };

  const handleExit = async () => {
    const enrichPromise = tryEnrichLatest();

    await Promise.race([
      enrichPromise,
      new Promise((res) =>
        setTimeout(res, 1000)
      ),
    ]);

    router.replace("/witness/home");
  };

  return (
    <SafeScreen>
      <QuickExit />

      <View className="flex-1 items-center justify-center px-6">
        <CircleInherit>
          <Check size={28} color="#16a34a" />
        </CircleInherit>

        <Text className="text-xl mt-8 mb-6 text-center">
          You did the right thing.
        </Text>

        <Pressable
          onPress={handleExit}
          className="bg-black px-6 py-3 rounded-xl w-[200px]"
        >
          <Text className="text-white text-center font-medium">
            Exit safely
          </Text>
        </Pressable>
      </View>
    </SafeScreen>
  );
}
