import { SimpleGrid, CheckboxCheckedChangeDetails } from "@chakra-ui/react";
import Seat from "./Seat";
import { Game, GameAction } from "@/types/tykar";
import { ActionDispatch } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { t } from "i18next";
import { useSession } from "@/hooks/AuthProvider";

function Seats({
  gameHook,
}: {
  gameHook: () => {
    game: Game | null;
    dispatch: ActionDispatch<[action: GameAction]>;
  };
}) {
  const { game, dispatch } = gameHook();
  const { session } = useSession();

  const userSeat = session
    ? game?.players.find((p) => p.username === session.username)
    : undefined;

  const handleReady = (e: CheckboxCheckedChangeDetails) => {
    if (e.checked) {
      dispatch({ type: "ready" });
    } else {
      dispatch({ type: "unready" });
    }
  };

  return (
    <>
      <SimpleGrid columns={2} gap="8px">
        {game?.players.map((player, i) => (
          <Seat
            player={player}
            seat={i}
            onClick={() => dispatch({ type: "sit_down", seat: i })}
            key={i}
          />
        ))}
      </SimpleGrid>
      {userSeat && game?.status != "in_progress" && (
        <Checkbox checked={userSeat.is_ready} onCheckedChange={handleReady}>
          {t("ready")}
        </Checkbox>
      )}
    </>
  );
}

export default Seats;
