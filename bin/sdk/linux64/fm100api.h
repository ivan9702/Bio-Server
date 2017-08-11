/*******************************************************************\
*   FM100API.h  :  header file of FM100API.LIB                      *
\*******************************************************************/
#define    OK                           0
#define    FAIL                        -1
#define    CALCELLED                   -1

#define    SNAP_TIME_LIMIT            100
#define    SNAP_COUNT				  100

#define    LPT1                         0
#define    LPT2                         1

#define    PRN_300DPI                   0
#define    PRN_150DPI                   1
#define    PRN_100DPI                   2
#define    PRN_75DPI                    3
#define    PRN_600DPI                   4 

/*-------------------------------------------*\
|   Return code of system integrator level    |
\*-------------------------------------------*/
#define    S_DOMAIN_ERR                -1
#define    S_RANGE_ERR                 -2
#define    S_MEM_ERR                   -3
#define    S_FILE_ERR                  -4
#define    S_COMM_ERR                  -5
#define    S_CHKSUM_ERR                -6
#define    S_TIME_OUT                  -7
#define    S_PRINT_ERR                 -8

#define    S_KEYCARD_CHECK_FAIL       -10
#define    S_EMPTY_IMAGE_SET          -11

#define    S_FPSET_INVALID            -21
#define    S_FPCODE_INVALID           -22
#define    S_FP_INVALID               -23
#define    S_SECURITY_ERR             -24

#define    S_NOT_SUPPORTED             -1
#define    S_VALID                   1
#define    S_INVALID               255  

#define     IDD_SNAP_MSG1               412
#define     IDD_SNAP_MSG2               413

#define     IDD_SNAP_GROUP              421

#define     IDD_ENRL_RLT                431

#define     IDS_POSITION_NO_FP          501
#define     IDS_POSITION_TOO_LOW        502 
#define     IDS_POSITION_TOO_TOP        503 
#define     IDS_POSITION_TOO_RIGHT      504 
#define     IDS_POSITION_TOO_LEFT       505 
#define     IDS_POSITION_TOO_LOW_RIGHT  506 
#define     IDS_POSITION_TOO_LOW_LEFT   507 
#define     IDS_POSITION_TOO_TOP_RIGHT  508 
#define     IDS_POSITION_TOO_TOP_LEFT   509 
#define     IDS_POSITION_OK             510

#define     IDS_DENSITY_TOO_DARK        511 
#define     IDS_DENSITY_TOO_LIGHT       512 
#define     IDS_DENSITY_AMBIGUOUS       513 
#define     IDS_DENSITY_OK             514
/*------------------------------*\
|   Return code of user level    |
\*------------------------------*/
#define    U_LEFT                     -41
#define    U_RIGHT                    -42
#define    U_UP                       -43
#define    U_DOWN                     -44

#define    U_POSITION_CHECK_MASK      0x00002F00
#define    U_POSITION_NO_FP           0x00002000
#define    U_POSITION_TOO_LOW         0x00000100
#define    U_POSITION_TOO_TOP         0x00000200
#define    U_POSITION_TOO_RIGHT       0x00000400
#define    U_POSITION_TOO_LEFT        0x00000800
#define    U_POSITION_TOO_LOW_RIGHT   (U_POSITION_TOO_LOW|U_POSITION_TOO_RIGHT)
#define    U_POSITION_TOO_LOW_LEFT    (U_POSITION_TOO_LOW|U_POSITION_TOO_LEFT)
#define    U_POSITION_TOO_TOP_RIGHT   (U_POSITION_TOO_TOP|U_POSITION_TOO_RIGHT)
#define    U_POSITION_TOO_TOP_LEFT    (U_POSITION_TOO_TOP|U_POSITION_TOO_LEFT)
#define     U_POSITION_OK             0x00000000

#define    U_DENSITY_CHECK_MASK       0x000000E0
#define    U_DENSITY_TOO_DARK         0x00000020
#define    U_DENSITY_TOO_LIGHT        0x00000040
#define    U_DENSITY_LITTLE_LIGHT     0x00000060
#define    U_DENSITY_AMBIGUOUS        0x00000080

#define    U_INSUFFICIENT_FP          -31
#define    U_NOT_YET                  -32
            
#define    U_LEFT                     -41
#define    U_RIGHT                    -42
#define    U_UP                       -43
#define    U_DOWN                     -44
            
#define    U_CLASS_A                 65
#define    U_CLASS_B                 66
#define    U_CLASS_C                 67
#define    U_CLASS_D                 68
#define    U_CLASS_E                 69
#define    U_CLASS_R				 82

/*---------------------------------*\
|   Definition of security level    |
\*---------------------------------*/
#define    AUTO_SECURITY		  0
#define    SECURITY_A                   1
#define    SECURITY_B                   2
#define    SECURITY_C                   3
#define    SECURITY_D                   4
#define    SECURITY_E                   5
#define    SECURITY_M                  30
#define    SECURITY_R                   40

#define    FP_IMAGE_WIDTH             256
#define    FP_IMAGE_HEIGHT            256
#define    GRAY_IMAGE_SIZE        (((long)FP_IMAGE_WIDTH)*(FP_IMAGE_HEIGHT))
#define    BIN_IMAGE_SIZE          (GRAY_IMAGE_SIZE/8)

#define		LARGE								10
#define		SMALL								11
#define    RAW							  12	
#define    BMP							   13	

#define    GRAY_IMAGE             8
#define    BIN_IMAGE                  1

#define    GRAY_LEVEL                 256
#define    GRAY_STEP     (256/GRAY_LEVEL)

/*---------------------------------*\
|   Definition of enrollment mode   |
\*---------------------------------*/
#define    DEFAULT_MODE              0x00
#define    FP_CODE_LENGTH             256

#define    Creat_FP_IMAGE_SET   Create_FP_IMAGE_SET
#define    Creat_FP_ENRL_SET    Create_FP_ENRL_SET

/*---------------------------------*\
|   Fingerprint image information   |
\*---------------------------------*/
typedef struct FP_Header {
    unsigned char   FP_sig[2];
    long            size;
    short           width;
    short           height;
    unsigned char   bit_per_pixel;
    unsigned char   compression;
    unsigned char   P_version;
    unsigned char   valid;
    unsigned char   reserved;
    unsigned char   chksum;
} FP_HEADER;

typedef struct FP_Image_Set
{
    FP_HEADER  header;
    unsigned char  *image;
} FP_IMAGE_SET;

/*----------------------------------------*\
|   Structure definition for enrollment    |
\*----------------------------------------*/
typedef struct
{
    short               quality;
    short               percentage;
    short               probability;    
    unsigned char       fp_code[FP_CODE_LENGTH];
} FP_ENRL_SET;

typedef struct
{
	unsigned char* image;
	short     nCount;
}FP_CAPTURE_SET;
/*
typedef struct FP_BMP {
    LPBITMAPINFO            lpBmpInfo;                
    unsigned char*     lpDib;
} FP_BMP_SET;
*/
/*----------------------------------------*\
|   Declaration of API functions           |
\*----------------------------------------*/
//extern short FP_ConnectCaptureDriver(void);
//extern void FP_DisconnectCaptureDriver(void);

/*
extern short FP_Snap(void);

extern FP_CAPTURE_SET* Create_FP_CAPTURE_SET(void);
extern short FP_Capture(FP_CAPTURE_SET *FP_Capture_Set);
extern short Destroy_FP_CAPTURE_SET(FP_CAPTURE_SET *FP_Capture_Set);

extern short FP_to_pcode( unsigned char *pcode );

extern FP_IMAGE_SET* Create_FP_IMAGE_SET( unsigned char mode ,unsigned short Size);
extern short FP_GetImage( FP_IMAGE_SET *image_set );
extern short Destroy_FP_IMAGE_SET( FP_IMAGE_SET *image_set );

extern FP_ENRL_SET *Create_FP_ENRL_SET( unsigned char mode );
extern short FP_Enroll( unsigned char *p_code, FP_ENRL_SET *enrl_set );
extern short Destroy_FP_ENRL_SET( FP_ENRL_SET *enrl_set );

extern short FP_Image_Match_S( unsigned char *fp_code, short security, long *score );
extern short FP_Code_Match_S( unsigned char *p_code,unsigned char *fp_code, short security,long *score );

extern short  FP_Check_Blank(void);
extern short  FP_Diagnose(void);

extern short FP_SaveImage(FP_IMAGE_SET *FP_Image_Set ,unsigned short FileType ,char *Filename);*/
