#include <stdio.h>

#define BUF_LEN 20

int main() 
{
	char buf[BUF_LEN];
	int i=0;
	while (i++ < BUF_LEN) {
		printf("Setting buf[%d] to zero. \n",i);
		buf[i] = 0;
	}
}
