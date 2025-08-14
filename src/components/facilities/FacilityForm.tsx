import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { X, Save, Upload, Trash2 } from "lucide-react";
import { FacilityFormData, FacilityType, DayHours } from "@/lib/types/facility";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const facilitySchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  type: z.enum([
    "tennis_court",
    "basketball_court",
    "volleyball_court",
    "swimming_pool",
    "football_field",
    "gym",
    "squash_court",
    "badminton_court",
    "track_field",
    "other",
  ]),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerHour: z.number().min(0, "Price must be positive").optional(),
  amenities: z.array(z.string()).default([]),
  operatingHours: z.object({
    monday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    tuesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    wednesday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    thursday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    friday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    saturday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
    sunday: z.object({
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    }),
  }),
});

interface FacilityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FacilityFormData) => Promise<void>;
  initialData?: Partial<FacilityFormData>;
  isEdit?: boolean;
}

const defaultHours: DayHours = {
  isOpen: true,
  openTime: "06:00",
  closeTime: "22:00",
};

const facilityTypeLabels: Record<FacilityType, string> = {
  tennis_court: "Tennis Court",
  basketball_court: "Basketball Court",
  volleyball_court: "Volleyball Court",
  swimming_pool: "Swimming Pool",
  football_field: "Football Field",
  gym: "Gym",
  squash_court: "Squash Court",
  badminton_court: "Badminton Court",
  track_field: "Track & Field",
  other: "Other",
};

export function FacilityForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: FacilityFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "tennis_court",
      capacity: initialData?.capacity || 1,
      location: initialData?.location || "",
      description: initialData?.description || "",
      pricePerHour: initialData?.pricePerHour || 0,
      amenities: initialData?.amenities || [],
      operatingHours: initialData?.operatingHours || {
        monday: defaultHours,
        tuesday: defaultHours,
        wednesday: defaultHours,
        thursday: defaultHours,
        friday: defaultHours,
        saturday: defaultHours,
        sunday: defaultHours,
      },
    },
  });

  const watchedAmenities = watch("amenities");

  const steps = [
    { title: "Basic Information", component: "basic" },
    { title: "Operating Hours", component: "hours" },
    { title: "Images", component: "images" },
    { title: "Amenities & Pricing", component: "amenities" },
    { title: "Review", component: "review" },
  ];

  const handleClose = () => {
    reset();
    setCurrentStep(0);
    onClose();
  };

  const handleFormSubmit = async (data: FacilityFormData) => {
    setIsSubmitting(true);
    try {
      // Include images in the form data
      const formDataWithImages = {
        ...data,
        images,
      };
      await onSubmit(formDataWithImages);
      handleClose();
    } catch (error) {
      console.error("Failed to submit facility:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const addAmenity = () => {
    if (newAmenity.trim()) {
      const currentAmenities = watchedAmenities || [];
      setValue("amenities", [...currentAmenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = watchedAmenities || [];
    setValue(
      "amenities",
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  const updateOperatingHours = (
    day: keyof typeof defaultHours,
    field: keyof DayHours,
    value: any
  ) => {
    const currentHours = getValues("operatingHours");
    setValue(`operatingHours.${day}.${field}`, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Facility" : "Create New Facility"}
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-slate-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 ml-3">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ml-3 ${
                      index < currentStep ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Facility Name *
                    </label>
                    <input
                      {...register("name")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter facility name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Facility Type *
                    </label>
                    <select
                      {...register("type")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(facilityTypeLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      {...register("capacity", { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter capacity"
                    />
                    {errors.capacity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location *
                    </label>
                    <input
                      {...register("location")}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter facility description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Operating Hours */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Operating Hours
                </h3>
                <div className="space-y-4">
                  {Object.entries(getValues("operatingHours")).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="w-24">
                          <p className="font-medium text-slate-900 capitalize">
                            {day}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-1">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={hours.isOpen}
                              onChange={(e) =>
                                updateOperatingHours(
                                  day as keyof typeof defaultHours,
                                  "isOpen",
                                  e.target.checked
                                )
                              }
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">Open</span>
                          </label>
                          {hours.isOpen && (
                            <>
                              <div>
                                <label className="block text-xs text-slate-600 mb-1">
                                  From
                                </label>
                                <input
                                  type="time"
                                  value={hours.openTime}
                                  onChange={(e) =>
                                    updateOperatingHours(
                                      day as keyof typeof defaultHours,
                                      "openTime",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-600 mb-1">
                                  To
                                </label>
                                <input
                                  type="time"
                                  value={hours.closeTime}
                                  onChange={(e) =>
                                    updateOperatingHours(
                                      day as keyof typeof defaultHours,
                                      "closeTime",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Images */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Facility Images
                </h3>
                <p className="text-sm text-slate-600">
                  Upload images to showcase your facility. High-quality photos
                  help users make better booking decisions.
                </p>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                />
              </div>
            )}

            {/* Step 4: Amenities & Pricing */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price per Hour (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">$</span>
                    </div>
                    <input
                      {...register("pricePerHour", { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.pricePerHour && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pricePerHour.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addAmenity())
                      }
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add an amenity"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedAmenities?.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Review Facility Information
                </h3>
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Name</p>
                      <p className="text-slate-900">{watch("name")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Type</p>
                      <p className="text-slate-900">
                        {facilityTypeLabels[watch("type")]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Capacity
                      </p>
                      <p className="text-slate-900">
                        {watch("capacity")} people
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Location
                      </p>
                      <p className="text-slate-900">{watch("location")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Description
                    </p>
                    <p className="text-slate-900">{watch("description")}</p>
                  </div>
                  {watch("pricePerHour") && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Price per Hour
                      </p>
                      <p className="text-slate-900">${watch("pricePerHour")}</p>
                    </div>
                  )}
                  {watchedAmenities && watchedAmenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Amenities
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {watchedAmenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Images
                      </p>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded overflow-hidden bg-slate-200"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {images.length} image(s) selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200">
            <button
              type="button"
              onClick={currentStep === 0 ? handleClose : prevStep}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {currentStep === 0 ? "Cancel" : "Previous"}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? "Update Facility" : "Create Facility"}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
