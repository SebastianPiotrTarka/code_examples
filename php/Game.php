<?php
declare(strict_types=1);

namespace Foo;

use Foo\Exception\CharacterAlreadyTriedException;
use Foo\Exception\DoNotCheatException;
use Foo\Exception\GameEndedException;
use Foo\Exception\NotACharacterException;
use Foo\Exception\WordCannotBeEmptyException;

final class Game implements GameInterface
{
    /**
     * @var Word
     */
    private $searchWord;

    /**
     * @var Rules
     */
    private $gameRules;

    /**
     * @param string $word word that player needs to guess
     *
     * @throws WordCannotBeEmptyException if given word is empty
     */
    public function __construct(string $word)
    {
        $this->searchWord = new Word($word);
        $this->gameRules = new Rules();
    }

    /**
     * @inheritDoc
     */
    public function check(string $letter): bool
    {
        if ($this->searchWord->wordsMatch() || $this->gameRules->numberErrorsExceeded()) {
            throw new GameEndedException('Game has been already ended');
        }

        if ($this->searchWord->hasLetterAlreadyBeenGiven($letter)) {
            throw new CharacterAlreadyTriedException('Character was already tried!');
        }

        if ($this->searchWord->isAllowed($letter)) {
            throw  new NotACharacterException('Value you tries is not english alfabet letter');
        }

        if ($this->searchWord->isLeterOccure($letter)) {
            return true;
        }

        $this->gameRules->notHit();;
        return false;
    }

    /**
     * @inheritDoc
     */
    public function guessWord(string $word): bool
    {

        if ($this->searchWord->wordsMatch()) {
            throw new GameEndedException('Game has been already ended');
        }

        $word = strtolower($word);
        if ($this->searchWord->wordToString() === $word) {

            $this->searchWord->setResult($word);

            return true;
        }

        $this->gameRules->quickEndFlagToTrue();

        return false;
    }

    /**
     * @inheritDoc
     */
    public function status(): string
    {
        if ($this->gameRules->isLost()) {
            return GameStatus::LOST;
        }

        if ($this->searchWord->wordsMatch()) {
            return GameStatus::WIN;
        }

        return GameStatus::RUNNING;
    }

    /**
     * @inheritDoc
     */
    public function isRunning(): bool
    {
        return $this->status() == GameStatus::RUNNING;
    }

    /**
     * @inheritDoc
     */
    public function mistakesLeft(): int
    {
        return $this->gameRules->lifeLeft();
    }

    /**
     * @inheritDoc
     */
    public function state(): array
    {
        return $this->searchWord->getResult();
    }

    /**
     * @inheritDoc
     */
    public function word(): string
    {
        if ($this->status() === GameStatus::RUNNING) {
            throw new DoNotCheatException('Game is running');
        }

        return $this->searchWord->wordToString();
    }

    /**
     * @inheritDoc
     */
    public function alreadyTried(string $letter): bool
    {
        return $this->searchWord->hasLetterAlreadyBeenGiven($letter);
    }

}
