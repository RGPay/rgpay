package com.rgpay.pos.core.errors

// Base class de erro
open class RgPayError(
    override val message: String,
    override val cause: Throwable? = null
) : Exception(message, cause)

// Device errors
class DeviceNotFoundError(message: String, cause: Throwable? = null) : RgPayError(message, cause)
class DeviceNotRegisteredError(message: String, cause: Throwable? = null) :
    RgPayError(message, cause)

class DeviceAlreadyAssignedError(message: String, cause: Throwable? = null) :
    RgPayError(message, cause)

class DeviceAlreadyRevokedError(message: String, cause: Throwable? = null) :
    RgPayError(message, cause)

class DeviceNotAssignedError(message: String, cause: Throwable? = null) : RgPayError(message, cause)
class ValidationError(message: String, cause: Throwable? = null) : RgPayError(message, cause)

// Tab errors
class TabAlreadyPaidError(message: String, cause: Throwable? = null) : RgPayError(message, cause)
class TabCancelledError(message: String, cause: Throwable? = null) : RgPayError(message, cause)
