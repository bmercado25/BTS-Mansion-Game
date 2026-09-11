#pragma once

#ifndef GALLERYPUZZLE_H
#define GALLERYPUZZLE_H

#include "Puzzle.h"
#include "ItemClass.h"
#include "PickUpItemClass.h"
#include "PlayerClass.h"
#include <string>
#include <vector>

class GalleryPuzzle : public Puzzle {
private:
	std::vector <ItemClass> portraits;
	std::vector<ItemClass> answers;

public:
	GalleryPuzzle(); //Default constructor
	GalleryPuzzle(std::vector <ItemClass> ports, std::vector <ItemClass> answer, std::string hint);

	void runPuzzle(); //Runs puzzle
};

#endif