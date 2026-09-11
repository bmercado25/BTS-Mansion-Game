#pragma once

#ifndef MAZEPUZZLE_H
#define MAZEPUZZLE_H

#include "Puzzle.h"
#include "UserInterfaceClass.h"
#include <string>
#include <vector>
#include <random>


class MazePuzzle : public Puzzle {
private:
	std::vector <std::string> symbolKey;
	std::vector <std::string> incorrectSymbols;

public:
	MazePuzzle(); //Default constructor
	MazePuzzle(std::vector<std::string> key, std::vector<std::string> inc);

	int GenerateRandomNumber(int min, int max);

	void runPuzzle(); //Runs puzzle
};

#endif#pragma once
