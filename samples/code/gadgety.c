#include <stdio.h>
#include <stdlib.h>

typedef void (*fptr)(int depth);

void decide(fptr f1, fptr f2, int depth);
void loop(int depth);
void no_op(int depth);

int main() {
	printf("Hello to a gadgety thingy. We're just going to\n");
	printf("make some jumps, run some loops and branch a lot.\n");
	printf("Then we're going to exit.\n");

	loop(1);
}

void decide(fptr f1, fptr f2, int depth)
{
	if (depth > 100)
	{
		return;
	}

	int r = rand();
	if (r % 2 == 1)
	{
		f1(depth+1);
	}
	else
	{
		f2(depth+1);
	}
}

void loop(int depth)
{
	if (depth > 100)
	{
		return;
	}

        int i;
	int max=rand();
	for (i = 0; i < max; i++)
	{
		decide(no_op, loop, depth+1);
	}
}

void no_op(int depth) {
	return;
}
