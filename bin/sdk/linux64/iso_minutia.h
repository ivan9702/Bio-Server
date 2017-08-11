
typedef struct FP_ISOminu_RECORD_HEADER{
	unsigned char	Format_Identifier[4];
	unsigned char	Standard_Version[4];
	unsigned char	Record_Length[4];
	unsigned short	Capture_Device;
	unsigned short	Image_Size_X;
	unsigned short	Image_Size_Y;
	unsigned short	Resolution_X;
	unsigned short	Resolution_Y;
	unsigned char	Finger_View_Number;
	unsigned char	Reserved;
}FP_ISOMINU_RECORD_HEADER;


typedef struct FP_ISOminu_FINGER_HEADER{
	unsigned char	Finger_Position;
	unsigned char	ViewN_ImpType;
	unsigned char	Finger_Quality;
	unsigned char	Minu_Num;
}FP_ISOMINU_FINGER_HEADER;


typedef struct FP_ISOminu_MINUTIA{
	unsigned short	X;
	unsigned short	Y;
	unsigned char	Dir;
	unsigned char	Quality;
	unsigned char	Type;
}FP_ISOMINU_MINUTIA;


typedef struct FP_ISOminu_COREDELTA{
	unsigned short	TypeIDcode;
	unsigned short	Ex_Data_Len;
	unsigned char	cTypeNum;	//type info and number of cores
	unsigned short	cX[15];
	unsigned short	cY[15];
	unsigned char	dTypeNum;	//type info and number of deltas
	unsigned short	dX[15];
	unsigned short	dY[15];

}FP_ISOMINU_COREDELTA;

typedef struct FP_ISOMINU_EXDATA_BLK{
	unsigned short Extended_Data_BlkLen;
	FP_ISOMINU_COREDELTA	core_delta_info;
}FP_ISOMINU_EXDATA_BLK;

typedef struct FP_ISOminu_FINGER_DATA{
	FP_ISOMINU_FINGER_HEADER	finger_header;
	FP_ISOMINU_MINUTIA	minutiae[80];
//	unsigned short	Extended_Data_length;
//	FP_ISOMINU_COREDELTA	core_delta_info;
	FP_ISOMINU_EXDATA_BLK	exdata_blk;

}FP_ISOMINU_FINGER_DATA;


typedef struct FP_ISOminu_record_set{
	FP_ISOMINU_RECORD_HEADER	record_header;
	FP_ISOMINU_FINGER_DATA	finger_data;

}FP_ISOMINU_RECORD_SET;