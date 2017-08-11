#define OK	0
#define FAIL	-1
#ifndef FALSE
#define FALSE               0
#endif

#ifndef TRUE
#define TRUE                1
#endif
/*from newlib31*/
#define BACK_GROUND	255
#define MIDDLE_BACK_GROUND	128
#define FORE_GROUND	30
#define GLOBAL_THRESHOLD 12
#define COARSE_X_THRESHOLD	200
#define COARSE_Y_THRESHOLD  200

/*from fp_read*/
#define        S_MEM_ERR            -3
#define        S_FILE_ERR           -4
#define    S_KEYCARD_CHECK_FAIL       -10
#define        S_FPSET_INVALID      -21
#define        S_FPCODE_INVALID     -22
#define    S_FP_INVALID               -23
#define        S_SECURITY_ERR       -24

/*from fp_match*/
#define        DEFAULT_MODE         0x00
#define        NO_RIDGE_MODE		0x01

/*---------------------------------*\
|   Definition of security level    |
\*---------------------------------*/
#define        AUTO_SECURITY        0
#define        SECURITY_A           1
#define        SECURITY_B           2
#define        SECURITY_C           3
#define        SECURITY_D           4
#define        SECURITY_E           5

/*------------------------------*\
|   Return code of user level    |
\*------------------------------*/
#define        U_INSUFFICIENT_FP    -31
#define        U_NOT_YET            -32

#define        U_LEFT               -41
#define        U_RIGHT              -42
#define        U_UP                 -43
#define        U_DOWN               -44

#define        U_CLASS_A            65
#define        U_CLASS_B            66
#define        U_CLASS_C            67
#define        U_CLASS_D            68
#define        U_CLASS_E            69
#define        U_CLASS_R            82

#define        Creat_FP_ENRL_SET       Create_FP_ENRL_SET

/*from k_match*/
#define        BLOCK_SIZE                8 
#define        END_FORK_NUMBER			1000
#define        MAX_REDUCE_TO_NUMBER        90
#define        ISO_REDUCE_TO_NUMBER        80
#define        REDUCE_TO_NUMBER        50
#define        TRACK_BOUND             8
#define        FP_CODE_LENGTH          256
#define        MIN_PAIR                  4

#define        ORI_IMG_WIDTH			256
#define        ORI_IMG_HEIGHT			256

#define        ROUGH_CLIP_IMG_WIDTH			256
#define        ROUGH_CLIP_IMG_HEIGHT		256
#define        ROUGH_CLIP_IMG_SUM			((long)ROUGH_CLIP_IMG_WIDTH)*(ROUGH_CLIP_IMG_HEIGHT)

#define        ROUGH_RIDGE_WIDTH			((ROUGH_CLIP_IMG_WIDTH)/(BLOCK_SIZE))
#define        ROUGH_RIDGE_HEIGHT			((ROUGH_CLIP_IMG_HEIGHT)/(BLOCK_SIZE))
#define        ROUGH_RIDGE_SUM				((ROUGH_RIDGE_WIDTH)*(ROUGH_RIDGE_HEIGHT))

#define        RIDGE_BLOCK					8
#define        RIDGE_FLOW_WIDTH				((PROCESSED_IMG_WIDTH)/(RIDGE_BLOCK))
#define        RIDGE_FLOW_HEIGHT			((PROCESSED_IMG_HEIGHT)/(RIDGE_BLOCK))
#define        RIDGE_FLOW_SUM				((RIDGE_FLOW_WIDTH)*(RIDGE_FLOW_HEIGHT))

#define        PROCESSED_IMG_WIDTH     256
#define        PROCESSED_IMG_HEIGHT    256

#define        FP_IMAGE_WIDTH	256
#define        FP_IMAGE_HEIGHT	256

/* type of error return in kernel level */
#define        K_DOMAIN_ERR                -1000
#define        K_RANGE_ERR                 -2000

/* Type of feature resolution */
#define        M_NOT_500DPI                0x00
#define        M_500DPI                    0x01
#define        M_IMAGE_PSEUDO_500DPI               0x02
#define        M_FEATURE_PSEUDO_500DPI             0x03
