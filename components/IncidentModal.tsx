import { playAudio } from "@/lib/audioPlayback";
import { extractIncidentFromTranscript } from "@/services/extractIncident";
import { transcribeAudio } from "@/services/transcribe";
import { useIncidentStore } from "@/store/useIncidentStore";
import { IncidentRecord } from "@/types/incident";
import { Pause, Play, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type PlayerControls = {
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
};

export function IncidentModal({
  incident,
  onClose,
}: {
  incident: IncidentRecord | null;
  onClose: () => void;
}) {
  const updateIncident = useIncidentStore((s) => s.updateIncident);

  const playerRef = useRef<PlayerControls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!incident || incident.transcript || processing) return;

    const run = async () => {
      try {
        setProcessing(true);

        const transcript = await transcribeAudio(
          incident.audioUri
        );

        const base: IncidentRecord = {
          ...incident,
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
      } finally {
        setProcessing(false);
      }
    };

    run();
  }, [incident?.id]);

  if (!incident) return null;

  const handlePlayPause = async () => {
    if (!playerRef.current) {
      const controls = await playAudio(
        incident.audioUri
      );
      playerRef.current = controls;
      setPlaying(true);
      return;
    }

    if (playing) {
      await playerRef.current.pause();
      setPlaying(false);
    } else {
      await playerRef.current.resume();
      setPlaying(true);
    }
  };

  const handleClose = async () => {
    if (playerRef.current) {
      await playerRef.current.stop();
      playerRef.current = null;
    }
    setPlaying(false);
    onClose();
  };

  const row = (label: string, value: string) => (
    <View>
      <Text className="text-xs text-gray-500 mb-1">
        {label}
      </Text>
      <Text className="text-sm text-gray-800">
        {value}
      </Text>
    </View>
  );

  return (
    <Modal transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center px-6">
        <View className="bg-white rounded-3xl p-6 max-h-[85%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-medium">
              Recorded Incident
            </Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <Pressable
            onPress={handlePlayPause}
            className="bg-black rounded-xl py-3 mb-4 flex-row items-center justify-center gap-2"
          >
            {playing ? (
              <Pause size={20} color="#ffffff" />
            ) : (
              <Play size={20} color="#ffffff" />
            )}
            <Text className="text-white font-medium">
              {playing ? "Pause" : "Play"}
            </Text>
          </Pressable>

          <ScrollView
            className="border border-gray-200 rounded-xl p-4"
            contentContainerStyle={{ gap: 14 }}
          >
            {processing && (
              <View className="items-center py-8">
                <ActivityIndicator />
                <Text className="text-xs text-gray-500 mt-2">
                  Processing recording…
                </Text>
              </View>
            )}

            {!processing &&
              row(
                "Summary",
                incident.summary ??
                  "No concerning content detected."
              )}

            {!processing &&
              row(
                "Time",
                incident.extracted?.time ??
                  "Not mentioned"
              )}

            {!processing &&
              row(
                "Location",
                incident.extracted?.location ??
                  "Not mentioned"
              )}

            {!processing &&
              row(
                "Actions",
                incident.extracted?.actions?.length
                  ? incident.extracted.actions.join(
                      ", "
                    )
                  : "No actions detected"
              )}

            {!processing &&
              row(
                "Witnesses",
                incident.extracted?.witnesses?.length
                  ? incident.extracted.witnesses.join(
                      ", "
                    )
                  : "No witnesses mentioned"
              )}

            {!processing &&
              row(
                "Children Present",
                incident.extracted?.childrenPresent ===
                  true
                  ? "Yes"
                  : incident.extracted
                      ?.childrenPresent === false
                  ? "No"
                  : "Not mentioned"
              )}

            {!processing &&
              row(
                "Prior Incidents",
                incident.extracted?.priorIncidents ===
                  true
                  ? "Yes"
                  : incident.extracted
                      ?.priorIncidents === false
                  ? "No"
                  : "Not mentioned"
              )}

            {!processing &&
              row(
                "Escalation Risk",
                incident.flags?.escalation
                  ? "Possible escalation detected"
                  : "No escalation detected"
              )}

            {!processing &&
              row(
                "Immediate Risk",
                incident.flags?.imminentRisk
                  ? "Immediate risk indicators present"
                  : "No immediate risk detected"
              )}

            {!processing &&
              incident.transcript &&
              row("Full Transcript", incident.transcript)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
