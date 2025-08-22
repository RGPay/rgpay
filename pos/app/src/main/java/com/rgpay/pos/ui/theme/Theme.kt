package com.rgpay.pos.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Dark scheme
private val RgpayDarkColorScheme = darkColorScheme(
    primary = RgpayPrimary,
    onPrimary = RgpayOnPrimary,
    primaryContainer = RgpayPrimaryDark,
    onPrimaryContainer = RgpayTextPrimaryDark,

    secondary = RgpaySecondary,
    onSecondary = RgpayOnSecondary,
    secondaryContainer = RgpaySecondaryDark,
    onSecondaryContainer = RgpayTextPrimaryDark,

    background = RgpayBackgroundDark,
    onBackground = RgpayTextPrimaryDark,
    surface = RgpaySurfaceDark,
    onSurface = RgpayTextPrimaryDark,
    surfaceVariant = RgpaySurfaceVariantDark,
    onSurfaceVariant = RgpayTextSecondaryDark,

    error = RgpayError,
    onError = RgpayOnPrimary,

    outline = RgpayBorderDark,
    outlineVariant = RgpayDividerDark,
    inverseSurface = RgpayTextPrimaryDark,
    inversePrimary = RgpayPrimaryDark
)

// Light scheme
private val RgpayLightColorScheme = lightColorScheme(
    primary = RgpayPrimary,
    onPrimary = RgpayOnPrimary,
    primaryContainer = RgpayPrimaryLight,
    onPrimaryContainer = RgpayPrimaryDark,

    secondary = RgpaySecondary,
    onSecondary = RgpayOnSecondary,
    secondaryContainer = RgpaySecondaryLight,
    onSecondaryContainer = RgpaySecondaryDark,

    background = RgpayBackgroundLight,
    onBackground = RgpayTextPrimaryLight,
    surface = RgpaySurfaceLight,
    onSurface = RgpayTextPrimaryLight,
    surfaceVariant = RgpaySurfaceVariantLight,
    onSurfaceVariant = RgpayTextSecondaryLight,

    error = RgpayError,
    onError = RgpayOnPrimary,
    errorContainer = Color(0xFFFFE0E0),
    onErrorContainer = Color(0xFFB71C1C),

    outline = RgpayBorderLight,
    outlineVariant = RgpayDividerLight,
    inverseSurface = RgpayBackgroundDark,
    inversePrimary = RgpayPrimaryDark
)

@Composable
fun RgpayTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> RgpayDarkColorScheme
        else -> RgpayLightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
