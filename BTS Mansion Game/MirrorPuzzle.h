#pragma once

#ifndef MIRRORPUZZLE_H
#define MIRRORPUZZLE_H

#include "Puzzle.h"
#include "UserInterfaceClass.h"
#include <string>
#include <vector>



class MirrorPuzzle : public Puzzle {
private:
	std::vector<std::string> answers;
	std::vector<std::string> correctAnswers;

public:
	MirrorPuzzle(); //Default constructor
	MirrorPuzzle(std::vector <std::string> correctAns);
	MirrorPuzzle(std::vector <std::string> correctAns, std::string hint);

	void runPuzzle(); //Runs puzzle
};

#endif