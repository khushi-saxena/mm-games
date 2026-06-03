import * as React from "react";
import cx from "classnames";
import styles from "./GameButton.module.scss";

export const GAME_BUTTON_COLORS = ["red", "green", "blue", "yellow"] as const;
export type GameButtonColor = typeof GAME_BUTTON_COLORS[number];

export interface IGameButtonProps {
  onClick?: () => void;
  color: GameButtonColor;
  highlighted?: boolean;
  disabled?: boolean;
}

export const GameButton = ({ onClick, color, highlighted, disabled }: IGameButtonProps) => {
  return (
    <div
      className={cx(styles.gameButton, styles[color], {
        [styles.highlighted]: highlighted,
        [styles.disabled]: disabled,
      })}
      onClick={disabled ? undefined : onClick}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    />
  );
};
