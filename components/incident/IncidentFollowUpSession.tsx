import { useIncidentStore } from "@/store/useIncidentStore";
import { Pressable, Text, View } from "react-native";

export function IncidentFollowUpSession({
  incidentId,
}: {
  incidentId: string;
}) {
  const incident = useIncidentStore((s) =>
    s.incidents.find((i) => i.id === incidentId)
  );

  const updateIncident = useIncidentStore(
    (s) => s.updateIncident
  );

  if (!incident?.followUpSession?.active) {
    return null;
  }

  const { questions, answers } =
    incident.followUpSession;

  const currentQuestion = questions.find(
    (q) => !q.answered
  );

  if (!currentQuestion) return null;

  const answer = (value: string) => {
    updateIncident(incident.id, {
      followUpSession: {
        ...incident.followUpSession!,
        questions: questions.map((q) =>
          q.id === currentQuestion.id
            ? { ...q, answered: true }
            : q
        ),
        answers: [
          ...answers,
          {
            questionId: currentQuestion.id,
            answer: value,
            answeredAt: Date.now(),
          },
        ],
        active: questions.every(
          (q) =>
            q.answered || q.id === currentQuestion.id
        ),
      },
    });
  };

  return (
    <View className="mt-4 p-4 border rounded-xl">
      <Text className="text-sm mb-3">
        {currentQuestion.question}
      </Text>

      <View className="flex-row gap-3">
        <Pressable
          className="px-4 py-2 border rounded-lg"
          onPress={() => answer("Yes")}
        >
          <Text>Yes</Text>
        </Pressable>

        <Pressable
          className="px-4 py-2 border rounded-lg"
          onPress={() => answer("No")}
        >
          <Text>No</Text>
        </Pressable>

        <Pressable
          onPress={() => answer("Skipped")}
        >
          <Text className="text-xs text-gray-500">
            Skip
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
