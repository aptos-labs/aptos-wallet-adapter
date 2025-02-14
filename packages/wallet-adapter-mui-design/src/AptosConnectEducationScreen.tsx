import { AboutAptosConnectEducationScreen } from '@aptos-labs/wallet-adapter-react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';

export function AptosConnectEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 1fr",
          alignItems: "center",
          justifyItems: "start",
        }}
      >
        <IconButton onClick={screen.cancel}>
          <ArrowBack />
        </IconButton>
        <Typography variant="body1" component="h2" width="100%" align="center">
          About Aptos Connect
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          pb: 1.5,
          alignItems: "end",
          justifyContent: "center",
          height: "162px",
        }}
      >
        <screen.Graphic />
      </Box>
      <Stack sx={{ gap: 1, textAlign: "center", pb: 2 }}>
        <Typography component={screen.Title} variant="h6" />
        <Typography
          component={screen.Description}
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
          sx={{
            "&>a": {
              color: (theme) => theme.palette.text.primary,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            },
          }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="text"
          onClick={screen.back}
          sx={{ justifySelf: "start" }}
        >
          Back
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            placeSelf: "center",
          }}
        >
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <Box
              key={i}
              component={ScreenIndicator}
              sx={{
                px: 0,
                py: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  height: "2px",
                  width: "24px",
                  bgcolor: (theme) => theme.palette.text.disabled,
                  "[data-active]>&": {
                    bgcolor: (theme) => theme.palette.text.primary,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
        <Button
          size="small"
          variant="text"
          onClick={screen.next}
          sx={{ justifySelf: "end" }}
          endIcon={<ArrowForward sx={{ height: 16, width: 16 }} />}
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </>
  );
}
