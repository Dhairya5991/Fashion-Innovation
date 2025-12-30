import pytest
from io import BytesIO
from PIL import Image
from ai_services.body_scanner.model import process_image_for_measurements

# Helper to create a dummy image in bytes
def create_dummy_image_bytes(width=10, height=10, color='red'):
    img = Image.new('RGB', (width, height), color=color)
    buf = BytesIO()
    img.save(buf, format='JPEG')
    return buf.getvalue()

def test_process_image_for_measurements_valid_image():
    """
    Test with a valid dummy image, expecting a dictionary of measurements.
    """
    dummy_image_bytes = create_dummy_image_bytes()
    measurements = process_image_for_measurements(dummy_image_bytes)

    assert isinstance(measurements, dict)
    assert "height" in measurements
    assert "chest" in measurements
    assert "waist" in measurements
    assert "hips" in measurements
    assert "unit" in measurements
    assert measurements["unit"] == "cm"

    # Check if values are within a reasonable range (based on mock logic)
    assert 160 <= measurements["height"] <= 190
    assert measurements["height"] * 0.4 <= measurements["waist"] <= measurements["height"] * 0.7 # Broad range for mock
    assert measurements["waist"] <= measurements["chest"] # Ensure chest is not smaller than waist
    assert measurements["waist"] <= measurements["hips"] # Ensure hips is not smaller than waist


def test_process_image_for_measurements_no_image_bytes():
    """
    Test with no image bytes, expecting a ValueError.
    """
    with pytest.raises(ValueError, match="No image bytes provided."):
        process_image_for_measurements(None)

    with pytest.raises(ValueError, match="No image bytes provided."):
        process_image_for_measurements(b'')

def test_process_image_for_measurements_invalid_image_format():
    """
    Test with invalid image data (not a real image format), expecting a ValueError.
    """
    invalid_image_bytes = b'this is not a valid image'
    with pytest.raises(ValueError, match="Invalid image data: cannot identify image file"):
        process_image_for_measurements(invalid_image_bytes)

def test_process_image_for_measurements_consistency():
    """
    Test that the mock logic always returns values within expected bounds.
    Run multiple times to check randomness.
    """
    for _ in range(10): # Run 10 times to test random generation
        dummy_image_bytes = create_dummy_image_bytes()
        measurements = process_image_for_measurements(dummy_image_bytes)

        assert isinstance(measurements["height"], (int, float))
        assert isinstance(measurements["chest"], (int, float))
        assert isinstance(measurements["waist"], (int, float))
        assert isinstance(measurements["hips"], (int, float))

        assert 160 <= measurements["height"] <= 190
        assert measurements["height"] * 0.4 <= measurements["waist"] <= measurements["height"] * 0.7 # Broad range for mock
        assert measurements["waist"] <= measurements["chest"]
        assert measurements["waist"] <= measurements["hips"]
